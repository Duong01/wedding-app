import https from "./https"


 // api GetWedding
 export const GetWedding = (slug, token) => {
  return https.Get( `/wedding/${encodeURIComponent(slug)}/${encodeURIComponent(token)}` );
};


 

