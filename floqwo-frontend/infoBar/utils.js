export function getDefaultIcon() {
    const now = new Date();
    const sunriseTime = new Date(document.getElementById('sunrise-time').textContent);
    const sunsetTime = new Date(document.getElementById('sunset-time').textContent);
    return now >= sunriseTime && now < sunsetTime ? 'broken-cloud-day.svg' : 'broken-cloud-night.svg';
  }
  
  export function setInfoBarHeight() {
    const infoBar = document.getElementById('info-bar');
    document.documentElement.style.setProperty('--info-bar-height', `${infoBar.offsetHeight}px`);
  }
  