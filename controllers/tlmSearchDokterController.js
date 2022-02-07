const { getData } = require("../models/tlmSearchDokterModel")

class tlmSearchDokter {

    // search data dokter/
    async doSearch(req, res) {
        let param = req.query

        try {
            // check coordinate
            if(!param.lat || param.lat == '0' || param.lat == null ||
            !param.long || param.long == '0' || param.long == null ) {
                return res.status(400).send({
                    'status': 400,
                    'msg' : 'User Location Not Found',
                })
            }
            
            const result = await getData(param)

            res.append('Access-Control-Expose-Headers', 'Page, PerPage, Total-Rows, Total-Pages')
            res.append('Page', result.page)
            res.append('PerPage', result.perPage)
            res.append('Total-Rows', result.totalRows)
            res.append('Total-Pages', result.totalPages)

            res.status(200).send({
                'status': 200,
                'msg' : 'Successfully',
                'data': result.data
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                'status': 500,
                'msg' : 'Internal Server Error',
                'error': err
            })
        }
    }

}

module.exports = tlmSearchDokter