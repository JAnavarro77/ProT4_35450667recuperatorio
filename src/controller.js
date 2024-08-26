import {pool} from './database.js';

class LibroController
{

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }
    //async add(req, res){
        //const libro = req.body;
       
        //const [result] = await pool.query(
            //`INSERT INTO libros (nombre, autor, categoria, año_publicacion, ISBN) VALUES (?, ?, ?, ?, ?)`, 
            //[libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.ISBN]
        
        //);
        //res.json({"Libro Insertado": result.insertId})
        async add(req, res) {
            try {
                const libro = req.body;
        
                // Verificar que el ISBN sea numérico y tenga 13 dígitos
                if (!/^\d{13}$/.test(libro.ISBN)) {
                    return res.status(400).json({ error: "El campo ISBN solo admite números y debe tener 13 dígitos." });
                }
        
                const [result] = await pool.query(`INSERT INTO Libros (nombre, autor, categoria, año_publicacion, ISBN) VALUES (?, ?, ?, ?, ?)`, 
                    [libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.ISBN]);
        
                res.json({ message: "Libro agregado con éxito", libroId: result.insertId });
            } catch (error) {
                res.status(500).json({ error: "Error al agregar el libro", details: error.message });
            }
        }
        
    

    //async delete(req, res) {
        //const libro= req.body;
        //const [result] = await pool.query(`DELETE FROM Libros WHERE ISBN=(?)`, [libro.ISBN]);
        //res.json({"Libros Eliminados": result.affectedRows});
        async delete(req, res) {
    try {
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM Libros WHERE ISBN=?`, [libro.ISBN]);     


        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }

        res.json({ message: "Libro eliminado", LibrosEliminados: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el libro", details: error.message });
    }
}



async update(req, res) {
    try {
        const libro = req.body;

        // Ejecutar la consulta de actualización
        const [result] = await pool.query(
            `UPDATE Libros SET nombre = ?, autor = ?, categoria = ?, año_publicacion = ? WHERE ISBN = ?`,
            [libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.ISBN]
        );

        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró un libro con el ISBN proporcionado." });
        }

        // Responder con el resultado de la actualización
        res.json({ message: "REGISTRO ACTUALIZADO", registrosActualizados: result.changedRows });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el libro", details: error.message });
    }
}

}

export const libro = new LibroController();