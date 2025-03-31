import { PostStrategy } from "./PostStrategy";
import { supabase } from "../../database/client";

// ระบุประเภทของข้อมูลที่คาดหวังจาก Supabase
interface PostSell {
  id_post: number;
  title: string;
}


export class ShopStrategy implements PostStrategy {
  async fetchPosts(userId: string) {
    const { data, error } = await supabase
      .from("MyShop")
      .select("*, Posts-sell(id_post, title)") // เลือก id_post และ title จาก Posts-sell
      .eq("by_userid", userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching shop: ${error.message}`);
    }

    // แปลงข้อมูลที่ได้จาก Supabase
    const transformedData = data.map((item: any) => {
      const postSell = item["Posts-sell"]; // เข้าถึงข้อมูล Posts-sell
      return {
        ...item,
        title: postSell ? postSell.title : '', // เชื่อม title จาก Posts-sell
        postId: item.id_post, // ใช้ id_post จาก MyShop
      };
    });

    return transformedData;
  }
}
