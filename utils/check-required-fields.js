/**
 * Проверяет наличие обязательных полей в объекте.
 * @param {string[]} fields - Массив строк с именами обязательных полей.
 * @param {object} body - Объект, который необходимо проверить.
 * @returns {string[]} - Массив имен полей, которые отсутствуют в объекте.
 */
const checkRequiredFields = (fields, body) =>
  fields.filter((field) => !body[field]);

module.exports = checkRequiredFields;
