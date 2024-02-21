const texts = ['Every Rain Begins With A Single Drop', 'Rain does not fall on one roof alone.', 'Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.','If I were rain, that joins heaven and earth that otherwise never touch, Could I be the rain joining two hearts as well?', 'Life Is Not About Storms To Pass, Its About Dancing In The Rain'];
const randomText = texts[Math.floor(Math.random() * texts.length)];

document.getElementsByClassName('text')[0].innerHTML = randomText;

const redirectionTime = Math.floor(Math.random() * 5) + 4;
setTimeout(() => {
    window.location.href = 'https://saptarshihalder.github.io/home/';
}, redirectionTime * 1000);
