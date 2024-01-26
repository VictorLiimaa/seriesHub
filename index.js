let serieNomeRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let resultado = document.getElementById("result");

// Select
let statusSeries = document.querySelector("#status")
let prioridade = document.getElementById("prioridade")

let escolher = document.querySelector("#escolher")

let serie = {}
let series = JSON.parse(localStorage.getItem("series"));

if (!Array.isArray(series)) {
    series = [];
}


statusSeries.addEventListener("change", () => {
    serie.status = statusSeries.value
})

prioridade.addEventListener("change", () => {
    serie.prioridade = prioridade.value
})

const deletarSerie = (nomeSerie) => {
    const seriesAtt = series.filter((serie) => {
        return serie.title !== nomeSerie
    })

    localStorage.setItem("series", JSON.stringify(seriesAtt))
    series = seriesAtt
    atualizarTabelas()
}

function atualizarTabelas() {
    const tbodyAssistir = document.getElementById('tbody-assistir');
    const tbodyAssistindo = document.getElementById('tbody-assistindo');
    const tbodyAssistido = document.getElementById('tbody-assistidos');

    if (!tbodyAssistir || !tbodyAssistindo || !tbodyAssistido) {
        console.error('Um ou mais elementos de corpo de tabela não foram encontrados.');
        return;
    }

    tbodyAssistir.innerHTML = "";
    tbodyAssistido.innerHTML = "";
    tbodyAssistindo.innerHTML = "";
    series.sort((a, b) => b.prioridade - a.prioridade);

    for (const serie of series) {
        const row = document.createElement('tr');

        const colPoster = document.createElement('td');
        colPoster.innerHTML = `<img src="${serie.poster}" alt="Poster" class="poster-thumbnail">`;
        colPoster.classList.add('colPoster');
        colPoster.setAttribute('data-poster', serie.poster);
        row.appendChild(colPoster);    
        
        const colPosters = document.getElementsByClassName('colPoster');

        for (const colPoster of colPosters) {
            const posterUrl = colPoster.getAttribute('data-poster');

            if (posterUrl) {
                colPoster.innerHTML = `<img src="${posterUrl}" alt="Poster" class="poster-thumbnail">`;
            } else {
                colPoster.innerHTML = "Poster";
            }
        }

        const colSerie = document.createElement('td');
        const colStatus = document.createElement('td');
        const colPrioridade = document.createElement('td');
        const colBotaoDeletar = document.createElement('td');

        const button = document.createElement("button");
        button.textContent = "Excluir";
        button.classList.add("excluir"); // Adicione a classe 'excluir' ao botão

        button.addEventListener("click", () => {
            deletarSerie(serie.title);
        });

        colBotaoDeletar.appendChild(button);


        colSerie.textContent = serie.title;
        colStatus.textContent = serie.status;
        colPrioridade.textContent = serie.prioridade;
        colBotaoDeletar.appendChild(button);

        row.appendChild(colSerie);
        row.appendChild(colStatus);

        if (serie.status.toLowerCase() === "assistir") {
            row.appendChild(colPrioridade);
            row.appendChild(colBotaoDeletar);
            tbodyAssistir.appendChild(row);
        } else if (serie.status.toLowerCase() === "assistido") {
            row.appendChild(colBotaoDeletar);
            tbodyAssistido.appendChild(row);
        } else {
            row.appendChild(colBotaoDeletar);
            tbodyAssistindo.appendChild(row);
        }
    }
}

escolher.addEventListener("click", () => {
    console.log("Série escolhida:", serie);
    const serieIndex = series.findIndex((serieAtual) => serieAtual.title == serie.title);
    if (serieIndex >= 0) {
        series[serieIndex] = serie;
    } else {
        series.push(serie);
    }

    const seriesToTexto = JSON.stringify(series);
    localStorage.setItem("series", seriesToTexto);

    atualizarTabelas();
});

prioridade.addEventListener("change", () => {
    serie.prioridade = prioridade.value;
});

const getSerie = () => {
    let nomeSerie = serieNomeRef.value;
    let url = `http://www.omdbapi.com/?t=${nomeSerie}&apikey=${key}`;

    if (nomeSerie.length <= 0) {
        resultado.innerHTML = `<h3 class="msg"> </h3>`;
    } else {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Resposta da API:", data);
            
                if (data.Response === "True") {
                    serie = {
                        title: data.Title,
                        poster: data.Poster,
                        status: statusSeries.value,
                    };

                    // Exibir detalhes do filme pesquisado
                    const filmePesquisadoElement = document.getElementById("filme-pesquisado");
                    filmePesquisadoElement.innerHTML = `
                        <div class="info">
                            <img src=${data.Poster} class="poster">
                            <div>
                                <h2>${data.Title}</h2>
                                <div class="rating">
                                    <h4>${data.imdbRating}</h4>
                                </div>
                                <div class="details">
                                    <span>${data.Year}</span>
                                    <span>${data.Runtime}</span>
                                </div>
                                <div class="genre">
                                    <div>${data.Genre.split(",").join("</div><div>")}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    resultado.innerHTML = ""; 

                } else {
                    resultado.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
                }
            })
            .catch((error) => {
                console.error("Erro na requisição:", error);
                resultado.innerHTML = `<h3 class="msg">Erro na requisição. Verifique a conexão ou tente novamente mais tarde.</h3>`;
            });
    }
};


atualizarTabelas()

searchBtn.addEventListener("click", getSerie);
window.addEventListener("load", getSerie);

function openTable(tableId) {
    const modal = document.getElementById(`modal-${tableId}`);
    if (modal) {
        modal.style.display = "block";
    } else {
        console.error(`Modal with ID 'modal-${tableId}' not found.`);
    }
}

function closeTable(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
}