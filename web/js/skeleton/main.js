define(['Backbone', './Skeleton', './ViewSwitcher', './Collection', './JstLoader', './Model', './Navigation', './RouteDelegate', './Router', './Spa', './View', './Repository'],
function(bb, Skeleton, ViewSwitcher, Collection, JstLoader, Model, Navigation, RouteDelegate, Router, Spa, View, Repository) {

    Skeleton.ViewSwitcher = ViewSwitcher;
    Skeleton.Collection = Collection;
    Skeleton.JstLoader = JstLoader;
    Skeleton.Model = Model;
    Skeleton.Navigation = Navigation;
    Skeleton.RouteDelegate = RouteDelegate;
    Skeleton.Router = Router;
    Skeleton.Spa = Spa;
    Skeleton.View = View;
    Skeleton.Repository = Repository;

    return Skeleton;
});