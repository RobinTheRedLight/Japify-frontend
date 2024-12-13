import { FaBook, FaPlayCircle } from "react-icons/fa";

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
}

const videos: Video[] = [
  {
    id: "1",
    title: "Japanese Beginner Lessons",
    description:
      "Start your journey with these beginner-friendly Japanese lessons.",
    youtubeId: "rGrBHiuPlT0",
  },
  {
    id: "2",
    title: "Essential Japanese Phrases",
    description:
      "Learn essential phrases for everyday conversations in Japanese.",
    youtubeId: "xwbXacBZyhE",
  },
  {
    id: "3",
    title: "Japanese Grammar Basics",
    description:
      "Understand the basics of Japanese grammar with easy explanations.",
    youtubeId: "BckC9gXghIc",
  },
  {
    id: "4",
    title: "Kanji Writing Practice",
    description:
      "Practice writing Kanji characters with step-by-step guidance.",
    youtubeId: "mPppVDX_GiY",
  },
  {
    id: "5",
    title: "Japanese Listening Comprehension",
    description:
      "Improve your listening skills with these Japanese comprehension exercises.",
    youtubeId: "GUqFU5u7rLQ",
  },
  {
    id: "6",
    title: "Conversational Japanese",
    description:
      "Enhance your conversational skills with practical Japanese dialogues.",
    youtubeId: "qo4YE0a4jaM",
  },
];

const Tutorial = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="pt-5">
        <div className=" p-8 max-w-7xl mx-auto bg-gradient-to-l from-blue-50 to-blue-100 shadow-lg rounded-md">
          <div className="hidden md:block">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800  flex items-center justify-center space-x-3 ">
              <FaBook className="text-blue-600 text-4xl  " />
              <span>Japanese Language Learning Tutorials</span>
            </h1>
            <p className="mt-4 text-center text-gray-600 text-lg">
              {" "}
              Enhance your Japanese skills with our curated collection of
              tutorial videos.
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 md:hidden">
            Japanese Language Learning Tutorials
          </h1>
        </div>
      </header>

      {/* Video Grid Section */}
      <main className="pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative pb-9/16">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
                    <FaPlayCircle className="mr-2 text-indigo-500" />
                    {video.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tutorial;
