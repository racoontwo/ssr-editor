import { strict as assert } from 'assert';

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

// testa anslutning till db
// testa lägga till dokument
// uppdatera dokument
// hämta adokument
// skapa test-databas
