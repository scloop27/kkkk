import { bilingualText } from "@/lib/utils";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {bilingualText("Settings", "సెట్టింగ్‌లు")}
      </h1>
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {bilingualText("Settings page coming soon", "సెట్టింగ్‌ల పేజీ త్వరలో వస్తుంది")}
        </p>
      </div>
    </div>
  );
}