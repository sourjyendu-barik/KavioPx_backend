// Validates optional image metadata fields: tags, person, isFavorite.
// Returns { valid: boolean, message?: string }
const validateImageInput = ({ tags, person, isFavorite }) => {
  if (tags !== undefined && (typeof tags !== "string" || !tags.trim())) {
    return { valid: false, message: "Tags must be a non-empty string" };
  }

  if (person !== undefined && typeof person !== "string") {
    return { valid: false, message: "Person must be a string" };
  }

  if (isFavorite !== undefined && !["true", "false"].includes(isFavorite)) {
    return { valid: false, message: "isFavorite must be true or false" };
  }
  return { valid: true };
};

module.exports = { validateImageInput };
