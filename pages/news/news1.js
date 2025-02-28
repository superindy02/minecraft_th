import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';

export default function News1() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">อัพเดทเซิร์ฟเวอร์ 1.20.2</h1>
                <p className="text-gray-600 mb-4">วันที่ 15 มกราคม 2024</p>
                <div className="prose max-w-none">
                    <p>เซิร์ฟเวอร์ของเราได้อัพเดทเป็นเวอร์ชัน 1.20.2 แล้ว! มาพบกับฟีเจอร์ใหม่ๆ มากมาย:</p>
                    <ul>
                        <li>เพิ่มสัตว์ใหม่</li>
                        <li>บล็อกใหม่</li>
                        <li>ระบบการคราฟของใหม่</li>
                        <li>แก้บั๊กต่างๆ</li>
                    </ul>
                    <p>เข้ามาเล่นกันได้แล้ววันนี้!</p>
                </div>
            </div>
        </Layout>
    );
} 