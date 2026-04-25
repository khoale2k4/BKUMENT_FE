// file: src/components/home/PersonCard.tsx
import React from "react";
import clsx from "clsx";
import { UserPlus, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PersonMayKnow } from "@/lib/services/article.service";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

interface PersonCardProps {
  person: PersonMayKnow;
  isFollowed: boolean;
  isLoading: boolean;
  onFollow: (person: PersonMayKnow) => void;
  onClick: (person: PersonMayKnow) => void;
}

export default function PersonCard({
  person,
  isFollowed,
  isLoading,
  onFollow,
  onClick,
}: PersonCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <button
        className="flex items-center gap-3 min-w-0 flex-1 text-left group cursor-pointer"
        onClick={() => onClick(person)}
      >
        <div className="relative flex-shrink-0">
          {person.avatarUrl ? (
            <AuthenticatedImage
              src={person.avatarUrl}
              alt={person.fullName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-gray-300 transition"
              onError={(e: any) => {
                e.currentTarget.src =
                  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-gray-300 transition">
              <span className="text-lg font-semibold text-gray-600">
                {person.fullName?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-black truncate leading-snug">
            {person.fullName}
          </p>
          {person.university && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {person.university}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">
            {person.followerCount ?? 0} {t("home.people.followers")}
          </p>
        </div>
      </button>

      <button
        onClick={() => onFollow(person)}
        disabled={isFollowed || isLoading}
        className={clsx(
          "ml-4 flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer",
          isFollowed
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
            : isLoading
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-wait"
              : "bg-black text-white border-black hover:bg-gray-800",
        )}
      >
        {isFollowed ? (
          <>
            <Check className="w-3 h-3" /> {t("home.people.following")}
          </>
        ) : (
          <>
            <UserPlus className="w-3 h-3" /> {t("home.people.follow")}
          </>
        )}
      </button>
    </div>
  );
}
