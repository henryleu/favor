define(['Backbone', './Skeleton', './ViewSwitcher', './Collection', './JstLoader', './Model', './Navigation', './RouteDelegate', './Router', './Spa', './View'],
function(bb, Skeleton, ViewSwitcher, Collection, JstLoader, Model, Navigation, RouteDelegate, Router, Spa, View) {

    Skeleton.ViewSwitcher = ViewSwitcher;
    Skeleton.Collection = Collection;
    Skeleton.JstLoader = JstLoader;
    Skeleton.Model = Model;
    Skeleton.Navigation = Navigation;
    Skeleton.RouteDelegate = RouteDelegate;
    Skeleton.Router = Router;
    Skeleton.Spa = Spa;
    Skeleton.View = View;

    return Skeleton;
});