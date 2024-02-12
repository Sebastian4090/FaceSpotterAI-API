
// const PAT = process.env.PAT;
// const USER_ID = process.env.idUSER;
// const APP_ID = process.env.idAPP;
// const MODEL_ID = process.env.idMODEL;


const PAT = '299df6884f304559ba8cc43b13de7a3d'
const USER_ID = 'b30em380htn_dpasa';
const APP_ID = 'faceSpotterAI';
const MODEL_ID = 'face-detection';


import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);



const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            inputs: [
                { data: { image: { url: req.body.input, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log('Unable to work with API')
            }
            
            res.json(response);
        }
    );
}


const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

export {handleImage, handleApiCall};
