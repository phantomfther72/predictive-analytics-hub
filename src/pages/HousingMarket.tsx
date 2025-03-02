
      {isLoading ? (
        <Skeleton className="h-[250px] w-full" />
      ) : (
        <HousingMarketDashboard data={housingData || []} />
      )}
