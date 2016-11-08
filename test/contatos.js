
var app = require('../app');
var request = require('supertest')(app);

function checkError(error) {
    if(error) {
        console.log('Error: ' + error);
    }
}

describe('No controller contatos', function() {
    describe('o usuario nao logado', function() {
        it('deve ir para / ao fazer GET /contatos', function(done) {
            request.get('/contatos')
                .end(function(err, res) {
                    checkError(err);

                    res.headers.location.should.eql('/');
                    done();
                });
        });

        it('deve ir para / ao fazer GET /contatos/1', function(done) {
            request.get('/contatos/1')
                .end(function(err, res) {
                    checkError(err);

                    res.headers.location.should.eql('/');
                    done();
                });
        });

        it('deve ir para / ao fazer GET /contatos/1/editar', function(done) {
            request.get('/contatos/1/editar')
                .end(function(err, res) {
                    checkError(err);

                    res.headers.location.should.eql('/');
                    done();
                });
        });

        it('deve ir para / ao fazer POST /contatos', function(done) {
            request.post('/contatos')
                .end(function(err, res) {
                    checkError(err);

                    res.headers.location.should.eql('/');
                    done();
                });
        });

        it('deve ir para / ao fazer DELETE /contatos/1', function(done) {
            request.del('/contatos/1')
                .end(function(err, res) {
                    checkError(err);

                    res.headers.location.should.eql('/');
                    done();
                });
        });

        it('deve ir para / ao fazer PUT /contatos/1', function(done) {
            request.put('/contatos/1')
                .end(function(err, res) {
                    checkError(err);

                    res.headers.location.should.eql('/');
                    done();
                });
        });
    });

    describe('o usuario logado', function() {
        var login = {usuario: {nome: 'Teste', email: 'teste@teste'}}
        var contato = {contato: {nome: 'Teste', email: 'teste@teste'}}
        var cookie = {};

        beforeEach(function(done) {
            request.post('/entrar')
                .send(login)
                .end(function(err, res) {
                    checkError(err);

                    cookie = res.headers['set-cookie'];
                    done();
                });
        });

        it('deve retornar status 200 em GET /contatos', function(done) {
            var req = request.get('/contatos');
            req.cookies = cookie;

            req.end(function(err, res) {
                checkError(err);

                res.status.should.eql(200);
                done();
            });
        });

        it('deve ir para rota /contatos em POST /contato', function(done) {
            var contato = {contato: {nome: 'Teste', email: 'teste@teste'}};

            var req = request.post('/contatos');
            req.cookies = cookie;

            req.send(contato)
                .end(function(err, res) {
                    res.headers.location.should.eql('/contatos');
                    done();
                });
        });
    });
});