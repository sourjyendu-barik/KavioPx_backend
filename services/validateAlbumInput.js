const validateAlbumInput = ({ name, description }) => {
  if (typeof name !== "string" || !name.trim()) {
    return { valid: false, message: "Name is required and must be a string" };
  }

  if (name.trim().length > 100) {
    return { valid: false, message: "Name must be under 100 characters" };
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return { valid: false, message: "Description must be a string" };
    }
    if (description.trim().length > 500) {
      return {
        valid: false,
        message: "Description must be under 500 characters",
      };
    }
  }

  return {
    valid: true,
    data: {
      name: name.trim(),
      description: description?.trim() || undefined,
    },
  };
};

module.exports = { validateAlbumInput };
