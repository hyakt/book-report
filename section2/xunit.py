# -*- coding: utf-8 -*-

# テストスイートを管理するクラス
class TestCase:
    def __init__(self, name):
        self.name = name
    #  テストメソッドを動的に呼び出す
    def run(self):
        method = getattr(self, self.name)
        method()

# テストメソッドが実行されたか記録するクラス
class WasRun(TestCase):
    def __init__(self, name):
        self.wasRun = None
        super().__init__(name)
    # メソッドが実行されたか記録するメソッド
    def testMethod(self):
        self.wasRun = 1

# テストスイートをテストするクラス
class TestCaseTest(TestCase):
    def testRunning(self):
        test = WasRun("testMethod")
        assert(not test.wasRun)
        test.run()
        assert(test.wasRun)

TestCaseTest("testRunning").run()
