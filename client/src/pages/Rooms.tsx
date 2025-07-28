import { bilingualText } from "@/lib/utils";

export default function Rooms() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {bilingualText("Rooms", "గదులు")}
      </h1>
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {bilingualText("Room management coming soon", "గది నిర్వహణ త్వరలో వస్తుంది")}
        </p>
      </div>
    </div>
  );
}