const innerImage = document.querySelector('.inner-image')
const image = document.querySelector('#img')
const rangeInput = document.querySelector('#blur-range')
const downloadButton = document.querySelector('#download-button');
const fakeImg = document.querySelector('#fake-img')

const loaderWrapper = document.querySelector('.loading-wrapper')
const loader = document.querySelector('.loading')
const errorTitle = document.querySelector('.error')

rangeInput.addEventListener('input', () => {
    image.style.filter = `blur(${rangeInput.value}px)`
})

const addFileBtn = document.querySelector('.add__file-btn')
addFileBtn.addEventListener('change', () => {
    const files = addFileBtn.files
    const countFiles = files.length

    if(files.length >= 2) {
        errorTitle.innerHTML = `Вы выбрали ${files.length} изображения! Пожалуйста, выберете только 1 изображение!`
        errorTitle.classList.remove('none')
        return
    }

    loaderWrapper.style.display = 'flex'
    loader.classList.toggle('none')
    
    if(!countFiles) {
        errorTitle.innerHTML = `Не выбран файл!`
        errorTitle.classList.remove('none')

        loaderWrapper.style.display = 'none'
        loader.classList.toggle('none')
        return
    }

    errorTitle.innerHTML = ''
    errorTitle.classList.add('none')

    const selectedFile = files[0]
    if (!/^image/.test(selectedFile.type)) {
        errorTitle.innerHTML = `Выбранный файл не является изображением!`
        errorTitle.classList.remove('none')
        
        loaderWrapper.style.display = 'none'
        loader.classList.toggle('none')
        return
    } else {
        image.classList.add('after-upload')
        rangeInput.classList.remove('none')
        downloadButton.classList.remove('none')
        innerImage.classList.add('border-none')
        innerImage.classList.add('box-shadow-none')
        document.querySelector('.upload-btn').classList.add('none')
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.addEventListener('load', (e) => {
      image.src = e.target.result;
      image.alt = selectedFile.name;

      fakeImg.src = e.target.result
      fakeImg.alt = selectedFile.name;
    });

    reader.addEventListener('error', () => {
        errorTitle.innerHTML = `Произошла ошибка при чтении файла: ${selectedFile.name}`
        errorTitle.classList.remove('none')
    });

    setTimeout(() => {
        loaderWrapper.style.display = 'none'
        loader.classList.toggle('none')
    }, 2000);
})

let isMobile = {
	Android: function() {return navigator.userAgent.match(/Android/i);},
	BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};


downloadButton.addEventListener('click', () => {
    loaderWrapper.style.display = 'flex'
    loader.classList.toggle('none')
    
    const originalWidth = fakeImg.width;
    const originalHeight = fakeImg.height;


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    
    const rangeInputValue = +rangeInput.value + 6
    if(isMobile.any()) {
        ctx.filter = `blur(${+rangeInputValue + 20}px)`
    } else {
        ctx.filter = `blur(${rangeInputValue}px)`
    }
    ctx.drawImage(image, 0, 0, originalWidth, originalHeight);
    const blurredImageDataURL = canvas.toDataURL('image/jpeg', 1);
    const downloadLink = document.createElement('a');
    downloadLink.href = blurredImageDataURL;
    downloadLink.download = 'blurred_image.jpg';

    downloadLink.click();

    setTimeout(() => {
        loaderWrapper.style.display = 'none'
        loader.classList.toggle('none')
    }, 3000);
});