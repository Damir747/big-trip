export const findElementByValue = (value, elements, descriptionFlag) => {
	if (descriptionFlag) {
		return elements.find((el) => el.name === value)
	}
	return elements.find((el) => el.type === value).offers;
}