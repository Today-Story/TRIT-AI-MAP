const dummyData = [
  {
    id: "uK956ZH4hEo",
    profileName: "Profile",
    title:
      "Favorite spot in SeoulFavorite spot in SeoulFavorite spot in SeoulFavorite spot in SeoulFavorite spot in SeoulFavorite spot in Seoul",
    hashtags: ["#travel", "#shopping", "#food"],
  },
];

export default function Video() {
  return (
    <div className="grid grid-cols-2 gap-4 py-3">
      {dummyData.map((video) => (
        <div key={video.id} className="rounded-xl overflow-hidden shadow bg-primary-100">
          <div className="relative w-full aspect-video-vertical">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title={`Video ${video.id}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            />
          </div>
          <div className="p-2 space-y-2">
            <h3 className="text-sm font-bold line-clamp-2">{video.title}</h3>
            <div className="flex flex-nowrap gap-1 overflow-x-scroll">
              {video.hashtags.map((tag) => (
                <span key={tag} className="bg-gray-200 text-xs rounded-full px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
