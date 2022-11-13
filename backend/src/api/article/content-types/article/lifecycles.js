module.exports = {
    afterCreate(event) {
        const { result, params } = event;
        console.log(result)
        
        strapi.db.query('api::reaction.reaction').create({
            data: {
                article: result.id,
                angry: 0,
                dislike: 0,
                applause: 0,
                love: 0,
                sad: 0,
                shocked: 0,
                lol: 0,
            },
        });
    },
};