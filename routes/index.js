const { Router } = require("express")
const router = Router()
const sqlserver = require("mssql")
// Database
const mssqlConfig = {
    user: "apirestsuma",
    password: "suma1234",
    server: "localhost",
    database: "GUTT_PRUEBAS"
}
const local = '01'

router.get("/categorias", async (req,res) => {
    try {
        let pool = await sqlserver.connect(mssqlConfig)
        let results = await pool.request()
            .query('select ID_STA29, COD_AGR, NOM_AGR from STA29')
        let categorias = [], subcategorias = []   
        results['recordset'].forEach(element => {   
            if (element.COD_AGR.length === 2){
                categorias.push({
                    "id": element.ID_STA29,
                    "COD_AGR": element.COD_AGR,
                    "NOM_AGR": element.NOM_AGR,
                    "Subcategorias": []
                })
            }
        });
        results['recordset'].forEach(element => {   
            if (element.COD_AGR.length > 2){
                categorias.find(x => x.COD_AGR == element.COD_AGR.substring(0,2)).Subcategorias.push(element)
            }
        });
        res.json(categorias)
    } catch (err) {
        console.log(err) 
    }
})

router.get("/productos/subcategorias/:id", async (req, res) => {
    try {
        const consulta = `SELECT S.CANT_PEND, S.CANT_STOCK, C.NOM_AGR, P.COD_ARTICU , P.COD_BARRA, P.DESCRIPCIO, P.FECHA_ALTA, P.MOD_DESCAR, P.PTO_PEDIDO, P.SINONIMO, P.STOCK, P.STOCK_MAXI, P.STOCK_MINI, P.STOCK_NEG, P.FECHA_MODI, P.COD_STA11, P.ID_MEDIDA_STOCK, P.ID_MEDIDA_VENTAS, P.ID_STA11
        FROM STA11 AS P
        LEFT JOIN STA29 AS C 
        ON (C.COD_STA29 = '${req.params.id}')
        LEFT JOIN STA19 AS S
        ON (P.COD_ARTICU = S.COD_ARTICU AND S.COD_DEPOSI = '${local}')
        WHERE P.COD_ARTICU LIKE '${req.params.id}%'
        ORDER BY P.COD_ARTICU `
        let pool = await sqlserver.connect(mssqlConfig)
        let results = await pool.request()
            //.input('input_parameter', sql.Int, value)
            .query(consulta)
        res.json(results['recordset'])
    } catch (err) {
        console.log(err)
    }
})

router.get("/productos/categorias/:id", async (req, res) => {
    try {
        const consulta = `SELECT S.CANT_PEND, S.CANT_STOCK, C.NOM_AGR, P.COD_ARTICU , P.COD_BARRA, P.DESCRIPCIO, P.FECHA_ALTA, P.MOD_DESCAR, P.PTO_PEDIDO, P.SINONIMO, P.STOCK, P.STOCK_MAXI, P.STOCK_MINI, P.STOCK_NEG, P.FECHA_MODI, P.COD_STA11, P.ID_MEDIDA_STOCK, P.ID_MEDIDA_VENTAS, P.ID_STA11
        FROM STA11 AS P
        LEFT JOIN STA29 AS C 
        ON (C.COD_STA29 = '${req.params.id}')
        LEFT JOIN STA19 AS S
        ON (P.COD_ARTICU = S.COD_ARTICU AND S.COD_DEPOSI = '${local}')
        WHERE P.COD_ARTICU LIKE '${req.params.id}%'
        ORDER BY P.COD_ARTICU`
        let pool = await sqlserver.connect(mssqlConfig)
        let results = await pool.request()
            //.input('input_parameter', sql.Int, value)
            .query(consulta)
        res.json(results['recordset'])
    } catch (err) {
        console.log(err)
    }
})

router.get("/productos/buscar/codigo/:codigo", async (req, res) => {
    try {
        const consulta = `SELECT S.CANT_PEND, S.CANT_STOCK, P.COD_ARTICU , P.COD_BARRA, P.DESCRIPCIO, P.FECHA_ALTA, P.MOD_DESCAR, P.PTO_PEDIDO, P.SINONIMO, P.STOCK, P.STOCK_MAXI, P.STOCK_MINI, P.STOCK_NEG, P.FECHA_MODI, P.COD_STA11, P.ID_MEDIDA_STOCK, P.ID_MEDIDA_VENTAS, P.ID_STA11
        FROM STA11 AS P
        LEFT JOIN STA19 AS S
        ON (P.COD_ARTICU = S.COD_ARTICU AND S.COD_DEPOSI = '${local}')
        WHERE P.COD_ARTICU = '${req.params.codigo}'`
        let pool = await sqlserver.connect(mssqlConfig)
        let results = await pool.request()
            //.input('input_parameter', sql.Int, value)    
            .query(consulta)
        res.json(results['recordset'][0])
    } catch (err) {
        console.log(err)
    }   
})

router.get("/productos/buscar/barras/:barras", async (req, res) => {
    console.log(req.params.barras)
    try {
        const consulta = `SELECT S.CANT_PEND, S.CANT_STOCK, P.COD_ARTICU , P.COD_BARRA, P.DESCRIPCIO, P.FECHA_ALTA, P.MOD_DESCAR, P.PTO_PEDIDO, P.SINONIMO, P.STOCK, P.STOCK_MAXI, P.STOCK_MINI, P.STOCK_NEG, P.FECHA_MODI, P.COD_STA11, P.ID_MEDIDA_STOCK, P.ID_MEDIDA_VENTAS, P.ID_STA11
        FROM STA11 AS P
        LEFT JOIN STA19 AS S
        ON (P.COD_ARTICU = S.COD_ARTICU AND S.COD_DEPOSI = '${local}')
        WHERE P.COD_BARRA = '${req.params.barras}' `
        let pool = await sqlserver.connect(mssqlConfig)
        let results = await pool.request()
            //.input('input_parameter', sql.Int, value)    
            .query(consulta)
        if(results['recordset'][0]){
            res.json(results['recordset'][0])
        }else{
            res.status(400).json(false)
        }
    } catch (err) {
        console.log(err)
    }   
})
router.get("/productos/buscar/:texto", async (req, res) => {
    try {
        const consulta = `SELECT S.CANT_PEND, S.CANT_STOCK, P.COD_ARTICU , P.COD_BARRA, P.DESCRIPCIO, P.FECHA_ALTA, P.MOD_DESCAR, P.PTO_PEDIDO, P.SINONIMO, P.STOCK, P.STOCK_MAXI, P.STOCK_MINI, P.STOCK_NEG, P.FECHA_MODI, P.COD_STA11, P.ID_MEDIDA_STOCK, P.ID_MEDIDA_VENTAS, P.ID_STA11
        FROM STA11 AS P
        LEFT JOIN STA19 AS S
        ON (P.COD_ARTICU = S.COD_ARTICU AND S.COD_DEPOSI = '${local}')
        WHERE P.DESCRIPCIO LIKE '%${req.params.texto}%' OR P.COD_ARTICU LIKE '%${req.params.texto}%' OR P.COD_BARRA LIKE '%${req.params.texto}%' `
        let pool = await sqlserver.connect(mssqlConfig)
        let results = await pool.request()
            //.input('input_parameter', sql.Int, value)    
            .query(consulta)
        res.json(results['recordset'])
    } catch (err) {
        console.log(err)
    }   
})


module.exports = router;