const validateData = (schema, jsonData, mode) => {

    const result = schema.safeParse(jsonData);

    if (!result.success) {
        console.error(" validateData(): invalid data ('zod()')");
        console.error(`  zod(): ${result.error.issues[0].path}`);
        console.error(`       : ${result.error.issues[0].message}`);
        console.error(`       : ${jsonData[result.error.issues[0].path]}`);

        return false;
    }

    if (!(mode === 's' || mode === "silent"))
        console.log(" validateData(): Good Data, Proceeding..");

    return result.data;
};

export default validateData;