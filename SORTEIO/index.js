const fs = require('fs');
const csv = require('csv-parser');

// Função para ler os dados do arquivo CSV
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(Object.values(data)[0])) // Extrai a primeira coluna
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// Função para fazer o sorteio aleatório
function sortear(apartamentos) {
    const indice = Math.floor(Math.random() * apartamentos.length);
    return apartamentos.splice(indice, 1)[0]; // Remove e retorna o item sorteado
}

// Função para aguardar o tempo especificado
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função principal
async function realizarSorteio() {
    console.log('#########################################################################################');
    console.log('#########################################################################################');
    try {
        const vagas = await readCSV('vagas.csv');
        const apartamentos = await readCSV('apartamentos.csv');

        for (const vaga of vagas) {
            if (apartamentos.length === 0) {
                console.log(`## Vaga: ${vaga} | Apartamento: Não há apartamentos suficientes para todas as vagas.`);
            } else {
                const apartamentoSorteado = sortear(apartamentos);
                console.log(`## Vaga: ${vaga} | Apartamento: ${apartamentoSorteado}`);
            }

            // Aguarda 1 segundos antes de processar a próxima vaga
            await wait(1000);
        }
    } catch (error) {
        console.error(`Erro no processamento`);
    }
    console.log('#########################################################################################');
    console.log('#########################################################################################');
}

realizarSorteio();
