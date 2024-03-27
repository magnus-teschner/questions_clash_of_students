#!/usr/bin/env python
import pika, sys, os, json
import mysql.connector



def main() -> None:
    
    #parameters
    host1 = "rabbit"
    port1 = 5672
    queue_name1 = "questionsQueue"

    def create_connection_channel(host: str, port: int, queue_name: str):
        print(host)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=host, port = port))
        channel = connection.channel()
        return channel

    #queue 1
    channel1 = create_connection_channel(host1, port1, queue_name1)


    def create_mysql_connection():
        db_host = "db"
        db_user = "root"
        db_password = "my-secret-pw"

        db_connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
        )
        return db_connection
    

    def create_database(connection):
        cursor = connection.cursor()


        create_table_query = "CREATE DATABASE IF NOT EXISTS questions;"
        # Execute the SQL query
        cursor.execute(create_table_query)
        cursor.close()
    
    def create_table(connection):
        cursor = connection.cursor()


        create_table_query = """
        CREATE TABLE IF NOT EXISTS questions.final_questions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            frage TEXT,
            option_a VARCHAR(255),
            option_b VARCHAR(255),
            option_c VARCHAR(255),
            option_d VARCHAR(255),
            correct_option VARCHAR(255),
            course VARCHAR(255),
            level INT,
            position INT,
        );
        """
        # Execute the SQL query
        cursor.execute(create_table_query)
        cursor.close()

    #connection = create_mysql_connection()

    #create_database(connection)
    #create_table(connection)
    

    def write_in_table(connection, object):
        cursor = connection.cursor()

        # SQL query to insert data
        insert_query = """
        INSERT INTO questions.quiz_questions (frage, option_a, option_b, option_c, option_d)
        VALUES (%s, %s, %s, %s, %s)
        """


        # Execute the SQL query
        cursor.execute(insert_query, object)

        # Commit the transaction
        connection.commit()
        cursor.close()
        




    def callback(ch, method, properties, body):
        connection = create_mysql_connection()

        decoded_body = body.decode('utf-8')
        decoded_body = json.loads(decoded_body)
        decoded_body = decoded_body["question"]
        mysql_data = (decoded_body["frage"], decoded_body["a"], decoded_body["b"], decoded_body["c"], decoded_body["d"])
        write_in_table(connection, mysql_data)


    channel1.basic_consume(queue=queue_name1, on_message_callback=callback, auto_ack=True)
    channel1.start_consuming()

if __name__ == '__main__':
    main()