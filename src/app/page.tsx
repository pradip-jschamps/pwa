import PushToggle from "@/components/save-subscribe/PushToggle";

export default function Home() {

  return (
    <div className="flex flex-col justify-center items-center mt-40">
      <p className="text-center">Welcome to our website! <br /> We are glad you are here. Explore our features, discover what we offer, and feel free to reach out if you need any help.</p>
      <PushToggle
        backendUrl={process.env.NEXT_PUBLIC_BASE_URL_API || ""}
      />
    </div>
  );
}
