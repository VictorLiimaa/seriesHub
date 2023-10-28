let serieNomeRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let resultado = document.getElementById("result");


// Select
let strimings = document.querySelector(".strimings")
let statusSeries = document.querySelector("#status")
let prioridade = document.getElementById("prioridade")

let escolher = document.querySelector("#escolher")

let serie = {}
let series = JSON.parse(localStorage.getItem("series")) || []



strimings.addEventListener("change", () => {
    serie.striming = strimings.value
})

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

function atualizarTabelas(){
    const tbodyAssistir = document.getElementById('tbody-assistir');
    const tbodyAssistido = document.getElementById('tbody-assistido');
    
    tbodyAssistir.innerHTML = ""
    tbodyAssistido.innerHTML = ""
    series.sort((a, b) => b.prioridade - a.prioridade);

    for (const serie of series) {
        const row = document.createElement('tr');

        const colSerie = document.createElement('td');
        const colDistribuidor = document.createElement('td');
        const colStatus = document.createElement('td');
        const colPrioridade = document.createElement('td');
        const colBotaoDeletar = document.createElement('td');

        const button = document.createElement("button")
        button.textContent = "Excluir"

        button.addEventListener("click", () => {
            deletarSerie(serie.title)
        })

        colSerie.textContent = serie.title;
        colDistribuidor.textContent = serie.striming;
        colStatus.textContent = serie.status;
        colPrioridade.textContent = serie.prioridade;
        colBotaoDeletar.appendChild(button)


        row.appendChild(colSerie);
        row.appendChild(colDistribuidor);
        row.appendChild(colStatus);

        if (serie.status == "assistir") {
            row.appendChild(colPrioridade);
            row.appendChild(colBotaoDeletar);
            tbodyAssistir.appendChild(row)
        } else {
            row.appendChild(colBotaoDeletar);
            tbodyAssistido.appendChild(row);

        }

    }

}


escolher.addEventListener("click", () => {


    const serieIndex = series.findIndex((serieAtual) => serieAtual.title == serie.title)
    if (serieIndex >= 0) {
        series[serieIndex] = serie
    } else {
        series.push(serie)
    }
    
    const seriesToTexto = JSON.stringify(series)
    localStorage.setItem("series", seriesToTexto)

    atualizarTabelas()
})


const getSerie = () => {
    let nomeSerie = serieNomeRef.value;
    let url = `http://www.omdbapi.com/?t=${nomeSerie}&apikey=${key}`;


    if (nomeSerie.length <= 0) {
        resultado.innerHTML = `<h3 class="msg"> </h3>`;
    } else {
        fetch(url).then((resp) => resp.json()).then((data) => {

            if (data.Response == "True") {
                serie = {
                    title: data.Title,
                    porter: data.Poster,
                    striming: strimings.value,
                    status: statusSeries.value,
                }
                resultado.innerHTML = `
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
            }

            else {
                resultado.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
            }
        })
            .catch(() => {
                resultado.innerHTML = `<h3 class="msg">Error Occured</h3>`;
            });
    }
};

atualizarTabelas()

searchBtn.addEventListener("click", getSerie);
window.addEventListener("load", getSerie);