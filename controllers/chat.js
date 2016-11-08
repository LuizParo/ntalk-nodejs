module.exports = function(app) {
    return {
        index : function(req, res) {
            var resultado = {
                email : req.params.email,
            };

            res.render('chat/index', resultado);
        }
    };
};