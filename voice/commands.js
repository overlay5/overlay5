(function(){
  if (typeof window.VOICE_COMMANDS_RE === 'undefined') {
    window.VOICE_COMMANDS_RE = {}
  }

  let lastCommand = 0;

  function debounceCommand() {
    const now = new Date()
    // check how many ms passed since last command
    if (now - lastCommand > 1000) {
      lastCommand = now
      return true // enough time from last command
    }
    console.log('debounced!')
    return false // don't allow the command to pass
  }

  function languageEnglish(recognition) {
    if (debounceCommand()) return;
    recognition.lang = 'en-US'
    recognition.stop()
    return ' !EN! '
  }

  function languageRussian(recognition) {
    if (debounceCommand()) return;
    recognition.lang = 'ru-RU'
    recognition.stop()
    return ' !RU! '
  }

  function languageHebrew(recognition) {
    if (debounceCommand()) return;
    recognition.lang = 'he'
    recognition.stop()
    return ' !HE! '
  }

  function lightDesktopToggle(recognition) {
    if (debounceCommand()) return;
    fetch('http://sonoff-desktop/cm?cmnd=Power+TOGGLE', { mode: 'no-cors' })
    return ' !LD! '
  }

  function lightCeilingToggle(recognition) {
    if (debounceCommand()) return;
    fetch('http://sonoff-ceiling/cm?cmnd=Power+TOGGLE', { mode: 'no-cors' })
    return ' !LC! '
  }

  window.VOICE_COMMANDS_RE = {
    ['язык английский']: languageEnglish,
    ['שפה אנגלית']: languageEnglish,
    ['language russian']: languageRussian,
    ['שפה רוסית']: languageRussian,
    ['language hebrew']: languageHebrew,
    ['язык иврит']: languageHebrew,
    ['lights? desktop']: lightDesktopToggle,
    ['lights? ceiling']: lightCeilingToggle,
  }

})()
