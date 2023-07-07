function getFileBody(allFiles, type, lang) {
    let file = allFiles.find(
      (file) => file.type === type
    )

    let body = file?.body

    if (Array.isArray(body)) {
        body = body.find((b) => b.lang === lang)
    }

    return body?.body
}

module.exports = {
    getFileBody
}
