import axios from "axios";

export const getVideoByID = async function getUserVideo(userId: string) {
    try {
      const res = await axios.get('http://localhost:3000/api/streams',{
        params:{
          userId : userId
        }
      });
      console.log(res.data)
      return res.data; 
    } catch (error) {
      console.log(error)
      return null;
    }
}
