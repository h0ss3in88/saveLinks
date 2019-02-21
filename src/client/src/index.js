import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import moment from 'moment/moment';
let linksArray = [];
const showLinks = (data) => {
    let div = document.getElementById('showAllLinks');
    let table = document.createElement('table');
    table.classList.add('col-md-8');
    // table.classList.add('col-sm-8');
    table.classList.add('col-lg-8');
    // table.classList.add('col-xs-12');
    table.classList.add('table');
    table.classList.add('table-striped');
    table.classList.add('table-condensed');
    let caption = document.createElement('caption');
    caption.innerText = 'Links';
    let headRow = table.createTHead().insertRow(0);
    let numCell = headRow.insertCell(0);
    numCell.innerText = '#';
    let categoryCell = headRow.insertCell(1);
    categoryCell.innerText = 'Category';
    let linkCell = headRow.insertCell(2);
    linkCell.innerText = 'Link';
    let descriptionCell = headRow.insertCell(3);
    descriptionCell.innerText = 'Description';
    let ownerCell = headRow.insertCell(4);
    ownerCell.innerText = 'Owner';
    let tagsCell = headRow.insertCell(5);
    tagsCell.innerText = 'Tags';

    let tbody = table.createTBody();

    data.forEach((item, index) => {
        let bodyRow = tbody.insertRow(index);
        bodyRow.innerHTML += `<td><a href="https://localhost:5787/api/tags/${item._id}">${index+1}</a></td>`;
        bodyRow.innerHTML += `<td>${item.category}</td>`;
        bodyRow.innerHTML += `<td><a href="${item.link}">${item.link}</a></td>`;
        bodyRow.innerHTML += `<td>${item.description.length > 22 ? `${item.description.substr(0,30)} ...` : item.description }</td>`;
        bodyRow.innerHTML += `<td>${item.owner}</td>`;
        bodyRow.innerHTML += `<td>${item.tags.map(tag => { return `<a href="/api/links/tags/${tag}">${tag}</a>`; })}</td>`;
    });
    console.log(table);
    div.appendChild(table);
    let howManyLinks = document.getElementById("linksNum");
    howManyLinks.innerText = ` links : ${data.length}`;
};
const clearBox = () => {
    $('#category').val('');
    $('#link').val('');
    $('#description').val('');
    $('#owner').val('');
    $('#tags').val('');
};
const saveLink = () => {
    let data = {
        category: $('#category').val(),
        link : $('#link').val(),
        description : $('#description').val(),
        owner: $('#owner').val(),
        tags: $('#tags').val().split(',')
    };

    fetch('/api/links',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.status === 201) {
            clearBox();
            console.log(document.getElementById("linksNum").innerText);
        }
        return response.json();
    }).then((result) => {
        linksArray.push(result);
        showLinks(linksArray);
        console.log(document.getElementById("linksNum"));
    }).catch((err) => {
        console.log(err);
    });
};
const showTags = (data) => {
    let tagsListElm = document.getElementById('tagsList');
    data.forEach((item) => {
        tagsListElm.innerHTML +=
            `<a class="btn btn-sm btn-primary">${item}</a>`
    });
    document.getElementById('tagsNum').innerText = ` tags : ${data.length}`;
};
const getLinks = () => {
    return fetch('/api/links').then((response) => {
        return response.json()
    }).then((data) => {
        showLinks(data);
        linksArray= data.slice();
    }).catch((err) => {
        console.log(err);
    });
};
const getTags = () => {
    return fetch('/api/tags').then((response) => {
        return response.json();
    }).then(data => {
        showTags(data);
    }).catch((err) => {
        console.log(err);
    });
};
$(() => {
    setInterval(() => {
        $('#showTime').html(`<a href="#"> ${moment().format('MMMM Do YYYY, h:mm:ss a')}</a>`);
    }, 1000);
    $('#saveLink').on('click', (e) => {
        e.preventDefault();
        saveLink();
    });
    getLinks();
    getTags();
});

