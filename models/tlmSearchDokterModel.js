const { db } = require('../helpers/DBUtil')
const haversine = require('haversine-distance')
const { byValue, byNumber } = require('sort-es')


// get data dokter
const getData = async (param) => {

    let point1 = { 
        lat: param.lat, 
        lng: param.long
    }

    const query = {
        sql :   ' SELECT a.id_dokter, a.nama_dokter, a.email_dokter, a.gender_dokter, a.nik_dokter, a.availability_dokter, ' +
                ' a.biografi_dokter, a.bahasa_dokter, a.str_dokter, a.sip_dokter, a.tgllahir_dokter, a.ratingval_dokter, ' +
                ' a.ratingcnt_dokter, a.status_dokter, a.foto_dokter, ' +
                ' b.id_kota, b.nama_kota, ' +
                ' c.id_provinsi, c.nama_provinsi, ' +
                ' d.id_spesialisasi, d.nama_spesialisasi, ' +
                ` e.id_provider, e.nama_provider, CONCAT('${process.env.BASE_URL_STORAGE}', e.foto_provider) AS url_foto_provider, e.alamat_provider, e.lat_provider, e.lng_provider, ` +
                ' f.Value AS statusKonsultasi ' +
                ' FROM dokter a ' +
                ' LEFT JOIN kota b ON a.id_kota = b.id_kota ' +
                ' LEFT JOIN provinsi c ON b.id_provinsi = c.id_provinsi ' +
                ' LEFT JOIN jenis_spesialisasi d ON a.id_spesialisasi = d.id_spesialisasi ' +
                ' LEFT JOIN provider e ON e.id_provider = a.id_provider ' +
                ' LEFT JOIN Systems f ON f.SysCd = a.statuskonsul_dokter WHERE 1=1',
    }

    //dynamic filter
    if(param.id_dokter && param.id_dokter !== '') {
        query.sql += ` AND a.id_dokter = '${param.id_dokter}'`
    }

    if(param.id_provider && param.id_provider !== '') {
        query.sql += ` AND e.id_provider = '${param.id_provider}'`
    }

    if(param.id_spesialisasi && param.id_spesialisasi !== '') {
        query.sql += ` AND d.id_spesialisasi = '${param.id_spesialisasi}'`
    }

    // // Order data
    let dir = "asc";
    // if (param.orderBy && param.orderBy != "") {
    //     if (param.dir && (param.dir.toLowerCase() == "asc" || param.dir.toLowerCase() == "desc")) {
    //         dir = param.dir;
    //     }
    //         query.sql += ` ORDER BY a.${param.orderBy} ${dir} `;
    // } else {
    //     if (param.dir && (param.dir.toLowerCase() == "asc" || param.dir.toLowerCase() == "desc")) {
    //         dir = param.dir;
    //     }
            query.sql += ` ORDER BY a.statuskonsul_dokter ${dir}`
    // }

    // query.sql += `, a.nama_dokter ${dir}`

    let queryLength = await db.run(`SELECT COUNT(*) AS COUNT FROM (${query.sql})`)
    queryLength = queryLength[0].map(row => row.toJSON())
    let totalRows = queryLength[0].COUNT

    // limit and paging and such
    if (!param.perPage || param.perPage == "") {
        param.perPage = parseInt(process.env.ROW_PAGE);
    }

    let limit = 10
    if(param.perPage && param.perPage != "") {
        limit = param.perPage
    }

    let offset = 0
    if(param.page && param.page != "") {
        offset = limit * (param.page - 1)
    }

    query.sql += ` LIMIT ${limit} OFFSET ${offset} `;


    const results = await db.run(query)
    const rows = results[0].map(row => row.toJSON())
    if(rows.length > 0) {
        rows.forEach(e => {
            Object.assign(e,{"url_foto_dokter" : process.env.BASE_URL_STORAGE + e.foto_dokter})
            let point2 = { 
                lat: e.lat_provider, 
                lng: e.lng_provider
            }
            let haversine_m = haversine(point1, point2)
            let float_distance = (haversine_m /1000).toFixed(2)
            let dist = parseFloat(float_distance)
            Object.assign(e,{"distance" : dist})
        })   
    }
    let totalPages = Math.ceil(totalRows / param.perPage)

    let data = rows.sort(byValue(i => i.distance, byNumber()))

    return {
        page: parseInt(param.page),
        perPage: param.perPage,
        totalRows,
        totalPages,
        data
    }
}

module.exports = { getData }