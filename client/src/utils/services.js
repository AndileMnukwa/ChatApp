export const baseUrl = "http://local:5000/api"

export const postRequest = async(URL, body) =>{
    await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body
    });
    const data = await Response.json()

    if (!Response.ok){
        let message;

    if (data?.message){
        message = data.message;
    } else {
        message = data;
    }

    return { error: true, message };
    }

    return data;
}