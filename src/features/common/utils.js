/**
 * Get the first part from a location string:
 * "/a/b/c" returns "a",
 * "/a" returns "a";
 * otherwise, return an empty string
 */
export function getBasePath(path) {
  const firstIndex = path.indexOf("/")
  const secondIndex = path.indexOf("/", firstIndex + 1)
  if (firstIndex !== -1 && secondIndex !== -1) {
    return path.substring(firstIndex + 1, secondIndex)
  } else if (firstIndex !== -1) {
    return path.substring(firstIndex + 1)
  } else {
    return ""
  }
}

export function decodeJwtResponse(token) {
  let base64Url = token.split(".")[1]
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  let jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join("")
  )
  return JSON.parse(jsonPayload)
}
