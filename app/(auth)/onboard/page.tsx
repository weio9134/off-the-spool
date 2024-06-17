import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";

async function Page() {
  const user = await currentUser()
  if(!user) return (
    <div> NO USER FOUND </div>
  );

  const userInfo = {}
  // if (userInfo?.onboarded) redirect("/");

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    img: userInfo?.image || user?.imageUrl,
  }
  // const userData = {
  //   id: "123",
  //   objectId: "456",
  //   username: "tester",
  //   name: "test",
  //   bio: "testing",
  //   img: "",
  // }

  return (
    <main className="mx-auto max-w-3xl flex flex-col justify-start px-10 py-20">
      <h1 className="head-text"> Onboarding </h1>
      <p className="mt-3 text-base-regular text-light-2">
        Please complete your profile
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile 
          user={userData}
          title="Continue"
        />
      </section>
    </main>
  )
}

export default Page