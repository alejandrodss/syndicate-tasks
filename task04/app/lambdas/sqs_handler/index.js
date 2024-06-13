exports.handler = async (event) => {
    for(const record of event.Records) {
        try {
            console.log(record.body);
        } catch(e) {
            console.error(`There was an error in the SQS message. ${e}`);
        }
    }
};
