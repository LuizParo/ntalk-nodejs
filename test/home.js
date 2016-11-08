var app = require('../app');
var should = require('should');
var request = require('supertest')(app);

function checkError(error) {
    if(error) {
        console.log(error);
    }
}

describe('No controller home', () => {
    it('deve retornar status 200 ao fazer GET /', (done) => {
        request.get('/')
            .end((err, res) => {
                checkError(err);

                res.status.should.eql(200);
                done();
            });
    });

    it('deve ir para rota / ao fazer GET /sair', (done) => {
        request.get('/sair')
            .end((err, res) => {
                checkError(err);

                res.headers.location.should.eql('/');
                done();
            });
    });

    it('deve ir para rota /contatos ao fazer POST /entrar', (done) => {
        var login = {
            usuario : {
                nome : 'Teste',
                email : 'teste@teste'
            }
        };

        request.post('/entrar')
            .send(login)
            .end((err, res) => {
                checkError(err);
                
                res.headers.location.should.eql('/contatos');
                done();
            });
    });

    it('deve ir para rota / ao fazer POST /entrar', (done) => {
         var login = {
            usuario : {
                nome : '',
                email : ''
            }
        };

        request.post('/entrar')
            .send(login)
            .end((err, res) => {
                checkError(err);

                res.headers.location.should.eql('/');
                done();
            });
    });
});