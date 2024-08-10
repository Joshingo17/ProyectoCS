from flask import Flask, request, jsonify, send_from_directory
from flask_mysqldb import MySQL
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'proyecto_cs'
mysql = MySQL(app)

app.secret_key = "mysecretkey"
JWT_SECRET = 'your_jwt_secret_key'


def create_token(user_id, role):
    expiration = datetime.utcnow() + timedelta(seconds=15)
    token = jwt.encode({'user_id': user_id, 'role': role, 'exp': expiration}, JWT_SECRET, algorithm='HS256')
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# RUTAS
@app.route('/ingreso', methods=['POST'])
def ingreso():
    datos = request.get_json()
    usuario = datos['usuario']
    contraseña = datos['contraseña']

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM usuarios WHERE usuario = %s", (usuario,))
    user = cur.fetchone()
    cur.close()

    if user:
        user_id, usuario_db, contraseña_db, nombre_completo, numero_telefono, email, estado, rol, fecha_registro, fecha_ultima_actualizacion = user
        if estado != 'activo':
            response = {
                'informacion': 'Usuario Deshabilitado!',
                'usuario': False
            }
        elif contraseña != contraseña_db:
            response = {
                'informacion': 'Contraseña Incorrecta',
                'usuario': False
            }
        else:
            token = create_token(user_id, rol)
            response = {
                'informacion': 'Inicio de sesión exitoso',
                'usuario': True,
                'nombre_completo': nombre_completo,
                'user_id': user_id,
                'rol': rol,
                'token': token
            }
    else:
        response = {
            'informacion': 'Usuario no encontrado',
            'usuario': False
        }

    return jsonify(response)

@app.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'informacion': 'Token no proporcionado'}), 401

    payload = decode_token(token)
    if not payload:
        return jsonify({'informacion': 'Token inválido o expirado'}), 401

    return jsonify({'informacion': 'Acceso permitido', 'data': payload})


@app.route('/register', methods=['POST'])
def register():
    datos = request.get_json()
    usuario = datos['usuario']
    contraseña = datos['contraseña']
    nombre_completo = datos['nombre_completo']
    correo = datos['correo']
    numero_telefono = datos['numero_telefono']
    rol = datos['rol']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO usuarios (usuario, contraseña, nombre_completo, email, numero_telefono, estado, rol) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (usuario, contraseña, nombre_completo, correo, numero_telefono, 'activo', rol))
    mysql.connection.commit()
    cur.close()

    response = {'informacion': 'Usuario registrado exitosamente'}

    return jsonify(response)

@app.route('/agendar', methods=['POST'])
def agendar():
    datos = request.get_json()
    fecha_planeada = datos['fecha_planeada']
    informacion_vehiculo = datos['informacion_vehiculo']
    id_cliente = datos['id_cliente']

    fecha_actual = datetime.now()
    fecha_cita = datetime.strptime(fecha_planeada, '%Y-%m-%d %H:%M')

    if fecha_cita <= fecha_actual or fecha_cita > fecha_actual + timedelta(days=7):
        return jsonify({'informacion': 'Fecha inválida. Solo puedes agendar citas en los próximos 7 días.'}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM citas WHERE fecha_planeada = %s", [fecha_planeada])
    cita_existente = cur.fetchone()
    if cita_existente:
        cur.close()
        return jsonify({'informacion': 'Ya hay una cita programada para esta fecha y hora. Por favor, elige otro horario.'}), 400

    cur.execute("INSERT INTO citas (fecha_planeada, informacion_vehiculo, id_cliente) VALUES (%s, %s, %s)",
                (fecha_planeada, informacion_vehiculo, id_cliente))
    mysql.connection.commit()
    cur.close()

    return jsonify({'informacion': 'Cita agendada exitosamente'})

@app.route('/citas', methods=['GET'])
def obtener_citas():
    id_cliente = request.args.get('id_cliente')
    if not id_cliente:
        return jsonify({'informacion': 'ID del cliente no proporcionado.'}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT id_cita, fecha_planeada, informacion_vehiculo, fecha_registro, observaciones FROM citas WHERE id_cliente = %s", [id_cliente])
    citas = cur.fetchall()
    cur.close()

    citas_list = [{'id_cita': cita[0], 'fecha_planeada': cita[1], 'informacion_vehiculo': cita[2], 'fecha_registro': cita[3], 'observaciones': cita[4]} for cita in citas]
    return jsonify({'citas': citas_list})

@app.route('/deleteCita/<int:id>', methods=['DELETE'])
def deleteCita(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute('DELETE FROM citas WHERE id_cita = %s', (id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "informacion": str(e)})
    
@app.route('/citasa', methods=['GET'])
def obtener_citasa():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT c.id_cita, c.fecha_planeada, c.informacion_vehiculo, c.fecha_registro, c.observaciones, u.nombre_completo 
        FROM citas c 
        JOIN usuarios u ON c.id_cliente = u.id_usuario
    """)
    citas = cur.fetchall()
    cur.close()

    citas_list = [{
        'id_cita': cita[0], 
        'fecha_planeada': cita[1], 
        'informacion_vehiculo': cita[2], 
        'fecha_registro': cita[3], 
        'observaciones': cita[4],
        'nombre_completo': cita[5]
    } for cita in citas]

    return jsonify({'citas': citas_list})

@app.route('/update_observacion', methods=['POST'])
def update_observacion():
    datos = request.get_json()
    id_cita = datos['id_cita']
    nueva_observacion = datos['observacion']

    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE citas SET observaciones = %s WHERE id_cita = %s", (nueva_observacion, id_cita))
        mysql.connection.commit()
        cur.close()
        return jsonify({"success": True, "informacion": "Observación actualizada exitosamente"})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "informacion": str(e)})

@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id_usuario, usuario, nombre_completo, email, numero_telefono, rol, fecha_registro, estado FROM usuarios")
        usuarios = cur.fetchall()
        cur.close()

        usuarios_list = [{'id_usuario': usuario[0], 'usuario': usuario[1], 'nombre_completo': usuario[2], 'email': usuario[3], 'numero_telefono': usuario[4], 'rol': usuario[5], 'fecha_registro': usuario[6], 'estado': usuario[7]} for usuario in usuarios]
        return jsonify({'usuarios': usuarios_list})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "informacion": str(e)})

@app.route('/toggle_user_status', methods=['POST'])
def toggle_user_status():
    datos = request.get_json()
    id_usuario = datos['id_usuario']
    nuevo_estado = datos['estado']

    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE usuarios SET estado = %s WHERE id_usuario = %s", (nuevo_estado, id_usuario))
        mysql.connection.commit()
        cur.close()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "informacion": str(e)})

@app.route('/change_user_role', methods=['POST'])
def change_user_role():
    datos = request.get_json()
    id_usuario = datos['id_usuario']
    nuevo_rol = datos['rol']

    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE usuarios SET rol = %s WHERE id_usuario = %s", (nuevo_rol, id_usuario))
        mysql.connection.commit()
        cur.close()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "informacion": str(e)})

@app.route('/registrar_mantenimiento', methods=['POST'])
def registrar_mantenimiento():
    datos = request.get_json()
    id_cliente = datos['id_cliente']
    id_mecanico = datos['id_mecanico']
    descripcion = datos['descripcion']
    informacion_vehiculo = datos['informacion_vehiculo']
    como_llego = datos['como_llego']

    try:
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO mantenimientos (id_cliente, id_mecanico, descripcion_del_mantenimiento, informacion_vehiculo, como_llego) VALUES (%s, %s, %s, %s, %s)", 
                    (id_cliente, id_mecanico, descripcion, informacion_vehiculo, como_llego))
        mysql.connection.commit()
        cur.close()
        return jsonify({'success': True, 'informacion': 'Mantenimiento registrado exitosamente'})
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'informacion': 'Error al registrar el mantenimiento: ' + str(e)})
    
@app.route('/mantenimientos', methods=['GET'])
def obtener_mantenimientos():
    id_mecanico = request.args.get('id_mecanico')
    estado = request.args.get('estado')
    
    if not id_mecanico or not estado:
        return jsonify({'informacion': 'Parámetros insuficientes'}), 400

    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT m.id_mantenimiento, u.nombre_completo, m.informacion_vehiculo, m.descripcion_del_mantenimiento, m.como_llego, m.como_salio, m.fecha_inicio, m.fecha_finalizacion 
        FROM mantenimientos m
        JOIN usuarios u ON m.id_cliente = u.id_usuario
        WHERE m.id_mecanico = %s AND m.estado = %s
    """, (id_mecanico, estado))
    mantenimientos = cur.fetchall()
    cur.close()

    mantenimientos_list = [{
        'id_mantenimiento': mantenimiento[0],
        'nombre_completo': mantenimiento[1],
        'informacion_vehiculo': mantenimiento[2],
        'descripcion_del_mantenimiento': mantenimiento[3],
        'como_llego': mantenimiento[4],
        'como_salio': mantenimiento[5],
        'fecha_inicio': mantenimiento[6],
        'fecha_finalizacion': mantenimiento[7]
    } for mantenimiento in mantenimientos]

    return jsonify({'mantenimientos': mantenimientos_list})

@app.route('/agregar_como_salio', methods=['POST'])
def agregar_como_salio():
    datos = request.get_json()
    id_mantenimiento = datos['id_mantenimiento']
    como_salio = datos['como_salio']

    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE mantenimientos SET como_salio = %s WHERE id_mantenimiento = %s", (como_salio, id_mantenimiento))
        mysql.connection.commit()
        cur.close()
        return jsonify({'success': True, 'informacion': 'Foto de salida agregada con éxito'})
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'informacion': 'Error al agregar la foto de salida: ' + str(e)})

@app.route('/finalizar_mantenimiento', methods=['POST'])
def finalizar_mantenimiento():
    datos = request.get_json()
    id_mantenimiento = datos['id_mantenimiento']

    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE mantenimientos SET estado = 'finalizado', fecha_finalizacion = %s WHERE id_mantenimiento = %s", 
                    (datetime.now(), id_mantenimiento))
        mysql.connection.commit()
        cur.close()
        return jsonify({'success': True, 'informacion': 'Mantenimiento finalizado con éxito'})
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'informacion': 'Error al finalizar el mantenimiento: ' + str(e)})

@app.route('/mantenimientos_cliente', methods=['GET'])
def obtener_mantenimientos_cliente():
    id_cliente = request.args.get('id_cliente')
    estado = request.args.get('estado')
    
    if not id_cliente or not estado:
        return jsonify({'informacion': 'Parámetros insuficientes'}), 400

    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT m.id_mantenimiento, u.nombre_completo AS nombre_cliente, m.informacion_vehiculo, m.descripcion_del_mantenimiento, m.como_llego, m.como_salio, m.fecha_inicio, m.fecha_finalizacion, mec.nombre_completo AS nombre_mecanico 
        FROM mantenimientos m
        JOIN usuarios u ON m.id_cliente = u.id_usuario
        JOIN usuarios mec ON m.id_mecanico = mec.id_usuario
        WHERE m.id_cliente = %s AND m.estado = %s
    """, (id_cliente, estado))
    mantenimientos = cur.fetchall()
    cur.close()

    mantenimientos_list = [{
        'id_mantenimiento': mantenimiento[0],
        'nombre_cliente': mantenimiento[1],
        'informacion_vehiculo': mantenimiento[2],
        'descripcion_del_mantenimiento': mantenimiento[3],
        'como_llego': mantenimiento[4],
        'como_salio': mantenimiento[5],
        'fecha_inicio': mantenimiento[6],
        'fecha_finalizacion': mantenimiento[7],
        'nombre_mecanico': mantenimiento[8]
    } for mantenimiento in mantenimientos]

    return jsonify({'mantenimientos': mantenimientos_list})

@app.route('/mantenimientos_completos', methods=['GET'])
def obtener_mantenimientos_completos():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT m.id_mantenimiento, 
               u.nombre_completo AS nombre_cliente, 
               mec.nombre_completo AS nombre_mecanico, 
               m.informacion_vehiculo, 
               m.descripcion_del_mantenimiento, 
               m.como_llego, 
               m.como_salio, 
               m.fecha_inicio, 
               m.fecha_finalizacion,
                m.estado
        FROM mantenimientos m
        JOIN usuarios u ON m.id_cliente = u.id_usuario
        JOIN usuarios mec ON m.id_mecanico = mec.id_usuario
    """)
    mantenimientos = cur.fetchall()
    cur.close()

    mantenimientos_list = [{
        'id_mantenimiento': mantenimiento[0],
        'nombre_cliente': mantenimiento[1],
        'nombre_mecanico': mantenimiento[2],
        'informacion_vehiculo': mantenimiento[3],
        'descripcion_del_mantenimiento': mantenimiento[4],
        'como_llego': mantenimiento[5],
        'como_salio': mantenimiento[6],
        'fecha_inicio': mantenimiento[7],
        'fecha_finalizacion': mantenimiento[8],
        'estado': mantenimiento[9]
    } for mantenimiento in mantenimientos]

    return jsonify({'mantenimientos': mantenimientos_list})

# Nueva ruta para obtener datos del dashboard
@app.route('/dashboard-data', methods=['GET'])
def dashboard_data():
    cur = mysql.connection.cursor()

    cur.execute("SELECT COUNT(*) FROM usuarios WHERE estado = 'activo'")
    usuarios_activos = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM mantenimientos WHERE estado = 'en_proceso'")
    mantenimientos_proceso = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM mantenimientos WHERE estado = 'finalizado'")
    mantenimientos_finalizados = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM citas")
    numero_citas = cur.fetchone()[0]

    cur.close()

    data = {
        'usuarios_activos': usuarios_activos,
        'mantenimientos_proceso': mantenimientos_proceso,
        'mantenimientos_finalizados': mantenimientos_finalizados,
        'numero_citas': numero_citas
    }

    return jsonify(data)



if __name__ == "__main__":
    app.run(debug=True, port=3000)