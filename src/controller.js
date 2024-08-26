import {pool} from './database.js';

class LibroController{

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }
    async add(req, res){
        const libro = req.body;
       
        const [result] = await pool.query(
            `INSERT INTO libros (nombre, autor, categoria, año_publicacion, ISBN) VALUES (?, ?, ?, ?, ?)`, 
            [libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.ISBN]
        
        );
        res.json({"Libro Insertado": result.insertId})

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

    
    async update(req, res){
        const libro = req.body;
        const [result] = await pool.query(`UPDATE Libros SET nombre(?), autpr(?), categoria(?), año_publicacion(?), ISBN(?) WHERE ISBN=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.ISBN]);
        res.json ({"REGISTRO ACTUALIZADO": result.changedRows});
    }
}

export const libro = new LibroController();