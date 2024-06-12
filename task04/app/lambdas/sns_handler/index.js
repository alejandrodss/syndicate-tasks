exports.handler = async (event) => {
    for(const record of event.Records) {
        try {
            const message = JSON.stringify(record.Sns.Message);
            console.log(message);
        } catch(err) {
            console.error(`There was an error in the SQS message. ${err}`);
        }
    }
};
