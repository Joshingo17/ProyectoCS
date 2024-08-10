from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Habilita CORS en toda la aplicación

# Configuración de la conexión a la nueva base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'proyecto_cs'  # Cambiado a la nueva base de datos
}

def get_datos_from_query(query):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query)
        datos = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(datos)
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

# Rutas para obtener datos específicos
@app.route('/mecanicos_en_proceso', methods=['GET'])
def get_datos_mecanicos_en_proceso():
    query = '''
    SELECT id_mecanico AS mecanico, COUNT(*) AS cantidad_en_proceso
    FROM mantenimientos
    WHERE estado = 'en_proceso'
    GROUP BY id_mecanico
    '''
    return get_datos_from_query(query)

@app.route('/mecanicos_finalizado', methods=['GET'])
def get_datos_mecanicos_finalizado():
    query = '''
    SELECT id_mecanico AS mecanico, COUNT(*) AS cantidad_finalizados
    FROM mantenimientos
    WHERE estado = 'finalizado'
    GROUP BY id_mecanico
    '''
    return get_datos_from_query(query)

@app.route('/clientes_en_proceso', methods=['GET'])
def get_datos_clientes_en_proceso():
    query = '''
    SELECT id_cliente AS cliente, COUNT(*) AS cantidad_en_proceso
    FROM mantenimientos
    WHERE estado = 'en_proceso'
    GROUP BY id_cliente
    '''
    return get_datos_from_query(query)

@app.route('/clientes_finalizado', methods=['GET'])
def get_datos_clientes_finalizado():
    query = '''
    SELECT id_cliente AS cliente, COUNT(*) AS cantidad_finalizados
    FROM mantenimientos
    WHERE estado = 'finalizado'
    GROUP BY id_cliente
    '''
    return get_datos_from_query(query)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
