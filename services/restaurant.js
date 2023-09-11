const restaurant = (db) => {



    async function getTables() {
        // get all the available tables 
        //do this by checking if booked is flase which means that it is not taken
        const query = 'SELECT * FROM table_booking WHERE booked = false';
        const result = await db.any(query);
        return result;

    }


    async function bookTable({ tableName, username, phoneNumber, seats }) {
        // book a table by name

//this will go thogh the paramenter and check in username has values
        if (!username) {
            return "Please enter a username";
        }
        //this will go thogh the paramenter and check in phonenumber has values

        if (!phoneNumber) {
            return "Please enter a contact number"
        }

        //this checsk if the table name exist in the table and f it does not match the in th db table will retunr the message

        const tableExists = await db.oneOrNone('SELECT 1 FROM table_booking WHERE table_name = $1', tableName);

        if (!tableExists) {
            return "Invalid table name provided";
        }

        const tableCapacity = await db.oneOrNone('SELECT capacity FROM table_booking WHERE table_name = $1', tableName);
        if (seats > tableCapacity.capacity) {
            return "capacity greater than the table seats";
        }

        await db.none('INSERT INTO table_booking (table_name, username, contact_number, number_of_people, booked) VALUES ($1, $2, $3, $4, true)',
            [tableName, username, phoneNumber, seats]);

        return "booking successful";

    }




    async function getBookedTables() {
        // get all the booked tables


    }
    async function isTableBooked(tableName) {
       
            // // Query the database to check if the specified table is booked
            // const result = await db.oneOrNone('SELECT booked FROM table_booking WHERE table_name = $1', tableName);
    
            // // If a row was found, return the booking status (true or false)
            // if (!result.booked) {
            //     return true;
            // }else{
            //     return false
            // }

       
                let bookedStatus = await db.oneOrNone("SELECT booked FROM table_booking WHERE table_name = $1", [tableName]);
                       return bookedStatus.booked;
               
               
            
    }
    

    async function cancelTableBooking(tableName) {
        // cancel a table by name
    }

    async function getBookedTablesForUser(username) {
        // get user table booking
    }

    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        // editTableBooking,
        getBookedTablesForUser
    }
}

export default restaurant;