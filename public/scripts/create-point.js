
function populateUfs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(res => res.json())
        .then(states => {

            for (const state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }

        })
}

populateUfs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfselectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfselectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
        .then(res => res.json())
        .then(cities => {

            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false

        })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


//Itens de coleta
//Pegar todos o li's
const itemsToCollet = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollet) {
    item.addEventListener("click", handleSelectedItem)

}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const item = event.target
    //Adicionar ou remover uma classe com JS 
    item.classList.toggle("selected")

    const itemId = event.target.dataset.id


    console.log('Item ID: ',itemId)

    //verificar se existem itens selecionados
    //se sim, pegar os itens seleconados
    const alreadySelected = selectedItems.findIndex((item) => {
        const itemFound = item === itemId
        return itemFound
    })

    //se já estiver selecionado tirar da seleção
    if (alreadySelected >= 0) {
        //tirar da selçãao
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        selectedItems = filteredItems
    } else {
        //se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)
    }

    console.log('SelectedIdItems: ',selectedItems)
    //atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems

}

