const buildQuery = (query, allowedSearchFields = []) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.role) filter.role = query.role;

  if (query.search && allowedSearchFields.length > 0) {
    filter.$or = allowedSearchFields.map((field) => ({
      [field]: { $regex: query.search, $options: "i" },
    }));
  }

  return filter;
};

export default buildQuery;
