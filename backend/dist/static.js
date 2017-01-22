var teams = { // An object containing all the names and respective abbreviations of 30 teams currently playing in the National Hockey League
    'ANA': 'Anaheim Ducks', 'ARI': 'Arizona Coyotes', 'BOS': 'Boston Bruins', 'BUF': 'Buffalo Sabres',
    'CGY': 'Calgrary Flames', 'CAR': 'Carolina Hurricanes', 'CHI': 'Chicago Blackhawks', 'COL': 'Colorado Avalanche',
    'CBJ': 'Columbus Blue Jackets', 'DAL': 'Dallas Stars', 'DET': 'Detroit Red Wings', 'EDM': 'Edmonton Oilers',
    'FLA': 'Florida Panthers', 'LAK': 'Los Angeles Kings', 'MIN': 'Minnesota Wild', 'MTL': 'Montreal Canadiens',
    'NSH': 'Nashville Predators', 'NJD': 'New Jersey Devils', 'NYI': 'New York Islanders', 'NYR': 'New York Rangers',
    'OTT': 'Ottawa Senators', 'PHI': 'Philadelphia Flyers', 'PIT': 'Pittsburgh Penguins', 'SJS': 'San Jose Sharks',
    'STL': 'St. Louis Blues', 'TBL': 'Tampa Bay Lightning', 'TOR': 'Toronto Maple Leafs', 'VAN': 'Vancouver Canucks',
    'WSH': 'Washington Capitals', 'WPG': 'Winnipeg Jets'
};

var rotoWorldAbbs = { // abbreviations based on http://2rotoworld.com/teams/injuries/nhl/ana/
    'ANA': 'ana', 'ARI': 'ari', 'BOS': 'bos', 'BUF': 'buf',
    'CGY': 'cal', 'CAR': 'car', 'CHI': 'chi', 'COL': 'col',
    'CBJ': 'clm', 'DAL': 'dal', 'DET': 'det', 'EDM': 'edm',
    'FLA': 'fla', 'LAK': 'la', 'MIN': 'min', 'MTL': 'mon',
    'NSH': 'nas', 'NJD': 'nj', 'NYI': 'nyi', 'NYR': 'nyr',
    'OTT': 'ott', 'PHI': 'phi', 'PIT': 'pit', 'SJS': 'sj',
    'STL': 'stl', 'TBL': 'tb', 'TOR': 'tor', 'VAN': 'van',
    'WSH': 'was', 'WPG': 'wpg'
};

var sIAbbs = { // abbreviations based on http://www.si.com/nhl/schedule?date=2017-01-12
    'ANA': 'ANH', 'ARI': 'ARI', 'BOS': 'BOS', 'BUF': 'BUF',
    'CGY': 'CGY', 'CAR': 'CAR', 'CHI': 'CHI', 'COL': 'COL',
    'CBJ': 'CLS', 'DAL': 'DAL', 'DET': 'DET', 'EDM': 'EDM',
    'FLA': 'FLA', 'LAK': 'LA', 'MIN': 'MIN', 'MTL': 'MON',
    'NSH': 'NSH', 'NJD': 'NJ', 'NYI': 'NYI', 'NYR': 'NYR',
    'OTT': 'OTT', 'PHI': 'PHI', 'PIT': 'PIT', 'SJS': 'SJ',
    'STL': 'STL', 'TBL': 'TB', 'TOR': 'TOR', 'VAN': 'VAN',
    'WSH': 'WAS', 'WPG': 'WPG'
};

var StatsApiIds = { // ID's based on http://statsapi.web.nhl.com/api/v1/teams/
    'ANA': 24, 'ARI': 53, 'BOS': 6, 'BUF': 7,
    'CGY': 20, 'CAR': 12, 'CHI': 16, 'COL': 21,
    'CBJ': 29, 'DAL': 25, 'DET': 17, 'EDM': 22,
    'FLA': 13, 'LAK': 26, 'MIN': 30, 'MTL': 8,
    'NSH': 18, 'NJD': 1, 'NYI': 2, 'NYR': 3,
    'OTT': 9, 'PHI': 4, 'PIT': 5, 'SJS': 28,
    'STL': 19, 'TBL': 14, 'TOR': 10, 'VAN': 23,
    'WSH': 15, 'WPG': 52
};

var dailyFaceoffIds = { // ID's based on http://www.dailyfaceoff.com
    'ANA': 13, 'ARI': 35, 'BOS': 15, 'BUF': 16,
    'CGY': 17, 'CAR': 18, 'CHI': 19, 'COL': 20,
    'CBJ': 21, 'DAL': 22, 'DET': 23, 'EDM': 24,
    'FLA': 25, 'LAK': 26, 'MIN': 27, 'MTL': 28,
    'NSH': 29, 'NJD': 30, 'NYI': 31, 'NYR': 32,
    'OTT': 33, 'PHI': 34, 'PIT': 36, 'SJS': 37,
    'STL': 38, 'TBL': 39, 'TOR': 40, 'VAN': 41,
    'WSH': 42, 'WPG': 14
};


exports.teams = teams;
exports.StatsApiIds = StatsApiIds;
exports.dailyFaceoffIds = dailyFaceoffIds;
exports.rotoWorldAbbs = rotoWorldAbbs;
exports.sportsIllustratedIDs = sIAbbs;