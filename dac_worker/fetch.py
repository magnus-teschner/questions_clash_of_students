#!/usr/bin/env python
import mysql.connector

def fetch_data():
    try:
        # Database connection parameters
        db_host = "localhost"
        db_user = "root"
        db_password = "my-secret-pw"
        db_database = "questions"

        # Connect to the database
        connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_database
        )

        cursor = connection.cursor()

        # Query to fetch all rows from the table
        query = "SELECT * FROM quiz_questions"

        cursor.execute(query)

        # Fetch all rows
        rows = cursor.fetchall()

        if not rows:
            print("No data found in the table.")
        else:
            print("Data from quiz_questions table:")
            for row in rows:
                print(row)

    except mysql.connector.Error as e:
        print(f"Error: {e}")

    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    fetch_data()
