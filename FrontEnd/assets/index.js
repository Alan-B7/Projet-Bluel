// Déclaration  chemins 
const PATH_API = 'http://localhost:5678/api/';
const PATH_WORKS = 'works/';
const PATH_CATEGORIES = 'categories/';

// Fonction Fetch  des données de l'API
const fetchData = async (path) => {
    try {
        const response = await fetch(`${PATH_API}${path}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        return await response.json();
    } catch (error) {
        console.log( error );
    }
};


const getWorks = () => fetchData(PATH_WORKS);


const getCategories = () => fetchData(PATH_CATEGORIES);

// Focntion Suppression des travaux
const deleteWorks = async (id) => {
    if (!id || id < 0) return;
    
    try {
        const response = await fetch(PATH_API + PATH_WORKS + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userLogInToken.token}`
            },
        });
        if (!response.ok) {
           throw new Error('La suppression des données a échoué');
        }
    } catch (error) {
        console.log( error );
    }
};

// Fonction générale
const initialize = async () => {

    // Vérification token user
    checkLogin();

    // Affichage des boutons catégories
    initButtons();
    
    // Affichage des travaux 
    refreshWorks();
};

// Rafraîchissement des travaux 
const refreshWorks = async () => {
    let allWorks = await getWorks();
    console.log('All works fetched from API:', allWorks);
    generateWorks(allWorks);
    generateWorksInModal(allWorks);
    
    // Réinitialisation du formulaire
    resetForm();
}

// Vérification si utilisateur athentifié 
let userLogInToken = window.sessionStorage.getItem('loggedUser');
const checkLogin = () => {

    if (userLogInToken !== null ) {
        userLogInToken = JSON.parse(userLogInToken);
        
        const logInLogOut = document.getElementById("login-logout");
        logInLogOut.innerText = "logout";

        // Affichage des éléments de l'interface d'édition si authentifié
        editionModeWhenLogged();

        logInLogOut.addEventListener("click", function (event) {
            event.preventDefault();
            window.sessionStorage.removeItem("loggedUser");
            window.location.reload();
        });
    };
};

// fonction qui permet de générer les travaux 
const generateWorks = (allWorks) => {

    if (!allWorks)
        return

    // Sélection de la div qui accueillera les travaux et création elements

    const portfolioWorks = document.querySelector(".gallery");
    portfolioWorks.innerHTML = "";

    for (let i = 0; i < allWorks.length; i++) {
        const works = allWorks[i];

        
        let workElement = document.createElement("figure");
        workElement.dataset.id = works.id;

        
        const imageElement = document.createElement("img");
        imageElement.src = works.imageUrl;

        
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = works.title;

        
        portfolioWorks.appendChild(workElement);
        workElement.append(imageElement, titleElement);
    }
    console.log('Number of works generated:', allWorks.length);
};

// Fonction qui initialise les boutons de catégories et filtre les travaux

const initButtons = async () => {

    // Création de la div conteneur pour les boutons filtres
    const portfolioWorkss = document.querySelector(".gallery");
    const filtersSection = document.createElement("div");
    filtersSection.classList.add("filters-container");
    portfolioWorkss.before(filtersSection);

    // Création du bouton "Tous"
    const buttonAllWorks = document.createElement("button");
        buttonAllWorks.innerText = "Tous";
        buttonAllWorks.classList.add("filters");
        buttonAllWorks.classList.add("active");

    filtersSection.appendChild(buttonAllWorks);

    buttonAllWorks.addEventListener("click", async function() {
        document.querySelector(".gallery").innerHTML = "";
        let allWorks = await getWorks();
        generateWorks(allWorks);
    });

    // Afficher le bouton "activé"
    filtersSection.addEventListener("click", function(btn) {
        if (btn.target.classList.contains("active")) {
            return;
        }
        if (document.querySelector(".filters-container button.active") !== null) {
            document.querySelector(".filters-container button.active").classList.remove("active");
        }
        btn.target.classList.add("active")
    });

    // Affichage des catégories et travaux filtrés
    let allButtons = await getCategories();

    if (!allButtons)
        return 

    for (let i = 0; i < allButtons.length; i++) {
        const buttons = allButtons[i];

        let buttonElement = document.createElement("button");
        buttonElement.dataset.id = buttons.id;
        buttonElement.innerText = buttons.name;
        buttonElement.classList.add('filters');
        
        filtersSection.appendChild(buttonElement);

    // Remplacement des travaux par ceux filtrés après click

        buttonElement.addEventListener("click", async function() {
            document.querySelector(".gallery").innerHTML = "";

            let allWorks = await getWorks();
            const worksForCategory = allWorks.filter(work => work.category.id == buttonElement.dataset.id);
            generateWorks(worksForCategory);
        });
    };

    // Masquer les boutons filtres si connecté
    if (userLogInToken !== null) {
        filtersSection.innerHTML = "";
    }
};

// Bandeau noir "mode édition"
const editModeBlackBand = () => {
    const header = document.querySelector('header');
    header.style.marginTop = '110px';

    const headband = document.createElement('div');
    headband.classList.add('headband');

    const editionMode = document.createElement('div');
    editionMode.classList.add('edition-mode');

    const editModeText = document.createElement('p')
    editModeText.innerText = 'Mode édition';

    const editModeTextIcon = document.createElement('i');
    editModeTextIcon.classList.add('fa-regular');
    editModeTextIcon.classList.add('fa-pen-to-square');
    editModeTextIcon.style.color = '#FFFFFF';


    header.before(headband);
    headband.appendChild(editionMode);
    editionMode.appendChild(editModeTextIcon);
    editionMode.appendChild(editModeText);
};

// Création du bouton "modifier"
const editModeMainPhoto = () => {
    const mainPhoto = document.querySelector('#introduction figure img');

    const mainPhotoEdit = document.createElement('div');
    mainPhotoEdit.style.display = 'flex';
    mainPhotoEdit.style.width = '80%';
    mainPhotoEdit.style.margin = 'auto';
    mainPhotoEdit.style.marginTop = '1rem';
    mainPhotoEdit.style.cursor = 'pointer';

    const mainPhotoEditIcon = document.createElement('i');
    mainPhotoEditIcon.classList.add('fa-regular');
    mainPhotoEditIcon.classList.add('fa-pen-to-square');
    mainPhotoEditIcon.style.fontSize = '1em';
    mainPhotoEditIcon.style.color = '#000000';

    const mainPhotoEditText = document.createElement('p');
    mainPhotoEditText.style.fontSize = '1em';
    mainPhotoEditText.style.color = '#000000';
    mainPhotoEditText.style.marginLeft = '0.3rem';
    mainPhotoEditText.innerText = 'modifier';

    mainPhoto.after(mainPhotoEdit);
    mainPhotoEdit.appendChild(mainPhotoEditIcon);
    mainPhotoEdit.appendChild(mainPhotoEditText);
};

const editWorks = () => {
    const myProjects = document.querySelector('.change-title');

    const editButton = document.createElement('div');
    editButton.classList.add('js-modal');
    editButton.setAttribute('id','change-works-btn');

    const editButtonIcon = document.createElement('i');
    editButtonIcon.classList.add('fa-regular');
    editButtonIcon.classList.add('fa-pen-to-square')

    const editButtonText = document.createElement('a');
    editButtonText.href = '#modal1';
    editButtonText.style.marginLeft = '0.3rem';
    editButtonText.innerText = 'modifier';
    
    myProjects.appendChild(editButton);
    editButton.appendChild(editButtonIcon);
    editButton.appendChild(editButtonText);

    editButton.addEventListener('click', openModal);
};

// Fonction d'affichage des éléments du "mode édition"
const editionModeWhenLogged = () => {
    editModeBlackBand();
    editWorks();
};

// Initialisation Modale
let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];

// Fonction d'ouverture de la modale
const openModal = async (e) => {
    e.preventDefault();
    
    const target = e.target.getAttribute('href');
    modal = document.querySelector(target);
    modal.style.display = "";
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');

    // À chaque ouverture de la modale affichage des travaux (et non la dernière div affichée)
    showFirstModalPage();

    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    
    // Correction de navigation à l'intérieur de la modale
    const galleryModal = document.getElementById('modal-wrapper-gallery');
    const addWorkModal = document.getElementById('modal-wrapper-add-work');

    // Fermeture au click sur la croix sur la modale d'ajout de travaux
    document.getElementById('close-btn').addEventListener('click', closeModal);

    // Retour sur la modale de suppression au click sur la flèche
    document.getElementById('return-btn').addEventListener('click', function() {
        addWorkModal.style.display = 'none';
        galleryModal.style.display = null;

        // Réinitialisation du formulaire
        resetForm();
    });

    // Redirection sur la modale d'ajout au click sur le bouton "Ajouter une photo"
    document.getElementById('add-work-btn').addEventListener('click', function() {
        galleryModal.style.display = 'none';
        addWorkModal.style.display = null;
    });

    // Stop propagation sur la modale d'ajout de travaux
    document.getElementById('modal-wrapper-add-work').addEventListener('click', stopPropagation);

    // Affichage dynamique des catégories de travaux sur la modale d'ajout
    categoriesModalForm();

    // appel fonction regénération des travaux
    refreshWorks();
};

// Fonction Fermeture de la modale
const closeModal = async (e) => {
    if (modal === null) return;
    e.preventDefault();

    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    const hideModal = () => {
        modal.style.display = 'none'
        modal.removeEventListener('animationend', hideModal)
        modal = null
    };
    modal.addEventListener('animationend', hideModal);
    refreshWorks();
};

const stopPropagation = (e) => {
    e.stopPropagation();
};

//  Afficher la première div de la modale "gallerie"
const showFirstModalPage = () => {
    document.getElementById('modal-wrapper-gallery').style.display = "";
    document.getElementById('modal-wrapper-add-work').style.display = "none";
};

//  Affichage des catégories dans la modale d'ajout en tant qu'option
const categoriesModalForm = async () => {
    const selectCategoriesModal = document.getElementById('select-categories');
    selectCategoriesModal.innerHTML = "";
    
    const allCategories = await getCategories();

    if (!allCategories)
        return 

    allCategories.forEach((category) => {
        const optionElement = document.createElement('option');
        optionElement.value = category.id;
        optionElement.innerText = category.name;
    
        selectCategoriesModal.appendChild(optionElement);
    });
};

// Génération des éléments pour les travaux
const generateWorkElementsInModal = (works) => {
    // Créer l'élément figure pour les travaux
    const workElement = document.createElement('div');
    workElement.dataset.id = works.id;
    workElement.classList.add('miniature-works');

    // Créer l'image
    const imageElement = document.createElement('img');
    imageElement.src = works.imageUrl;

    // Créer l'icone poubelle
    const trashcanElement = document.createElement('i');
    trashcanElement.classList.add('trashcan');
    trashcanElement.classList.add('fa-solid');
    trashcanElement.classList.add('fa-trash-can');
    trashcanElement.dataset.id = works.id;

    // Créer la légende
    const titleElement = document.createElement('p');
    titleElement.innerText = 'éditer';

    // Rattachement des balises
    workElement.appendChild(imageElement);
    workElement.appendChild(trashcanElement);
    workElement.appendChild(titleElement);

    return workElement;
};

// Suppression des travaux au clic sur la poubelle
const deleteWorksClick = async (event) => {
    event.preventDefault();
    const idToDelete = event.target.dataset.id;
    await deleteWorks(idToDelete);
    refreshWorks();
};

// Génération des travaux dans la modale
const generateWorksInModal = (allWorks) => {
    if (!allWorks) 
        return;

    // Sélectionner la div gallerie qui accueillera les travaux
    const portfolioWorks = document.querySelector('#modal-gallery');
    portfolioWorks.innerHTML = '';

    allWorks.forEach((works) => {
        const workElement = generateWorkElementsInModal(works);

        workElement.querySelector('.trashcan').addEventListener('click', deleteWorksClick);

        portfolioWorks.appendChild(workElement);
    });
};

// Focus sur les éléments focusables ( touche Tab)
const focusInModal = (e) => {
    e.preventDefault();

    let index = focusables.findIndex((f) => f === modal.querySelector(':focus'));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    };
    if (index >= focusables.length) {
        index = 0;
    };
    if (index < 0) {
        index = focusables.length - 1;
    };
    focusables[index].focus();
};

// Écoute des touches Esc et Tab
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    };
});



// Ajout de travaux 
let addWorkForm = document.querySelector('#add-work-form');
let newWorkImage = document.querySelector('#work-image');
let newWorkTitle = document.querySelector('#work-title');
let newWorkCategory = document.querySelector('#select-categories');

// Vérification du type de fichier
const validateFileType = (file) => {
    const acceptedExtensions = ['.jpg', '.png'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

    return acceptedExtensions.includes(fileExtension);
};

// Vérification de la taille de fichier
const validateFileSize = (file) => {
    const maxFileSize = 4 * 1024 * 1024; // 4 Mo en octets

    return file.size <= maxFileSize;
};

// Fonction permettant d'ajouter des travaux à l'API
const postWorks = async (e) => {
    e.preventDefault();

    const file = newWorkImage.files[0];
    const title = newWorkTitle.value;
    const category = newWorkCategory.value;

    if (!file) {
        alert('Veuillez choisir une photo');
        return;
    }

    if (!title || !category) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const dataForm = new FormData();
    dataForm.append('image', file);
    dataForm.append('title', title);
    dataForm.append('category', category);

    try {
        const response = await fetch(PATH_API + PATH_WORKS, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Bearer ${userLogInToken.token}`
            },
            body: dataForm,
        });

        alert('Vous avez ajouté une photo');
        refreshWorks();
        showFirstModalPage();
    } catch(error) {
        console.log(error);
    }
};

// Prévisualisation de l'image à télécharger
let outputImagePreview = document.getElementById('output-image');
const photoPreview = function(e) {
    const file = e.target.files[0];
    const outputImagePreview = document.getElementById('output-image');

    if (!file) {
        outputImagePreview.style.display = 'none';
        return;
    }

    if (!validateFileType(file)) {
        alert('Veuillez choisir une photo .jpg ou .png');
        outputImagePreview.style.display = 'none';
        return;
    }

    if (!validateFileSize(file)) {
        alert('La taille de la photo ne doit pas dépasser 4 Mo');
        outputImagePreview.style.display = 'none';
        return;
    }

    outputImagePreview.src = URL.createObjectURL(file);
    outputImagePreview.onload = function() {
        URL.revokeObjectURL(outputImagePreview.src);
    };
    outputImagePreview.style.display = null;
};

newWorkImage.addEventListener('change', (e) => {
    photoPreview(e);
});


// Réinitialisation du formulaire d'ajout de travaux
const resetForm = function() {
    addWorkForm.reset();
    outputImagePreview.style.display = 'none';
    newWorkCategory.value = "";
};

// Envoi d'un nouvel travail à l'API lors de la soumission du formulaire
addWorkForm.addEventListener('submit', postWorks); 


// Appel fonction générale
initialize();
