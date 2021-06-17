const stylesheet = new URL(window.location).searchParams.get('stylesheet')

if (stylesheet) {
  const head = document.head
  const link = document.createElement('link')

  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = stylesheet

  head.appendChild(link)
}
